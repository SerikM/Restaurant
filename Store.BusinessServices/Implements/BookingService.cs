using Store.BusinessServices.Interfaces;
using Store.Data.DataEntities;
using Store.Data.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System;
using Store.BusinessServices.DTOs;
using System.Collections;
using Microsoft.AspNetCore.Html;

namespace Store.BusinessServices.Implements
{
    public class BookingService : IBookingService
    {
        private const int MAXIMUM_CAPACITY_PER_SLOT = 25;
        private const int NUMBER_OF_DAYS_FUTURE = 30;

        private readonly IBaseRepository<TblSlot> _slotsRepo;
        private readonly IBaseRepository<TblBooking> _bookingRepo;
        private readonly IEmailService _emailService;


        public BookingService(
            IBaseRepository<TblSlot> slotsRepo,
            IBaseRepository<TblBooking> bookingRepo,
            IEmailService emailService
            )
        {
            _slotsRepo = slotsRepo;
            _bookingRepo = bookingRepo;
            _emailService = emailService;
        }

        public bool Reserve(ReserveModel model)
        {
            var timeSlot = _slotsRepo
                .GetNumOfItemsWithInclude("BOOKINGS")
                .FirstOrDefault(p => p.DATE.ToString("yyyy-MM-dd") == model.selectedDate 
                && p.START_TIME.ToShortTimeString() == model.selectedHour);

            timeSlot.BOOKINGS.Add(new TblBooking
            {
                NAME = model.name,
                PHONE = model.phone,
                EMAIL = model.email,
                QUANTITY = model.quantity
            });

            var success = _slotsRepo.Commit();
            if (success)
            {
                model.emailSubject = "Rumpus Room booking completed";
                model.emailMessage = GetEmailMessage(model);
                _emailService.SendMail(model);
            }
            return success;
        }

        private string GetEmailMessage(ReserveModel model)
        {
            var message = $"Hi {model.name} your booking with RumpusRoom has now been complete. Please, find details of the booking below </br></br>" +
                $"Booking name: {model.name}</br>" +
                $"Booking date: {model.selectedDate}</br>" +
                $"Booking time: {model.selectedHour}</br>" +
                $"Number of guests: {model.quantity}</br>" +
                $"Location: 13B Burton St, Darlinghurst NSW 2010</br></br>" +
                $"We are looking forward to seeing you at RumpusRoom!";
            return message;
        }

        public List<ReserveModel> GetAvailableHours(string selectedDate)
        {
            var availableSlots = _slotsRepo
                .GetNumOfItemsWithInclude("BOOKINGS")
                .Where(d => d.DATE.ToString("yyyy-MM-dd") == selectedDate);
            var models = new List<ReserveModel>();

            foreach (TblSlot slot in availableSlots)
            {
                int booked = 0;
                foreach (TblBooking booking in slot.BOOKINGS)
                {
                    booked += booking.QUANTITY;
                }
                if (slot.CAPACITY > booked)
                {
                    models.Add(new ReserveModel
                    {
                        capacity = slot.CAPACITY - booked,
                        selectedHour = slot.START_TIME.ToShortTimeString()
                    });
                }
            }
            return models;
        }



        public List<string> GetAvailableDates()
        {
            var availableDateStrings = new List<string>();
            try
            {
                var allSlots = _slotsRepo.GetNumOfItemsWithInclude("BOOKINGS");
                var availableSlots = new List<TblSlot>();
                foreach (TblSlot slot in allSlots)
                {
                    int booked = 0;
                    foreach (TblBooking booking in slot.BOOKINGS)
                    {
                        booked += booking.QUANTITY;
                    }
                    if (slot.CAPACITY > booked)
                    {
                        availableSlots.Add(slot);
                    }
                }
                availableDateStrings = availableSlots.Select(f => f.DATE.ToString("yyyy-MM-dd")).ToList();
            }
            catch (Exception exc)
            {
            }
            
            return availableDateStrings;
        }
     }
}
