using Store.BusinessServices.Interfaces;
using Store.Data.DataEntities;
using Store.Data.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System;
using Store.BusinessServices.DTOs;

namespace Store.BusinessServices.Implements
{
    public class WhatsonService : IWhatsonService
    {
        private readonly IBaseRepository<TblEvent> _eventsRepo;

        public WhatsonService(IBaseRepository<TblEvent> eventsRepo)
        {
            _eventsRepo = eventsRepo;
        }

        public List<EventModel> GetEvents(int num, int current)
        {
            try
            {
             var events = _eventsRepo.GetNumOfItemsWithInclude("MEDIAS")
                    .OrderByDescending(p => p.DATE)
                    .Skip(current)
                    .Take(num)
                    .ToList();
                return events.Select(p => new EventModel
                {
                    ID = p.ID,
                    NAME = p.NAME,
                    DESCRIPTION = p.DESCRIPTION,
                    MEDIAS = p.MEDIAS.Select(d => new
                    TblMedia
                    {
                        ID = d.ID,
                        IMAGE = d.IMAGE,
                        URL  = d.URL
                    }).ToList()
             }).ToList();
            }
            catch (Exception exc)
            {
                return null;
            }
        }


        public void SaveEvent(byte[] image, int id, string name, string url, string description)
        {
            var entity = _eventsRepo.GetSingle(id);
            if (entity == null)
            {
                _eventsRepo.Add(new TblEvent
                {
                    DESCRIPTION = description,
                    NAME = name,
                    MEDIAS = new List<TblMedia>
                    {
                        new TblMedia
                        {
                            IMAGE = image,
                            URL = url
                        }
                    }
                });
            }
            else
            {
                entity.DESCRIPTION = description;
                entity.NAME = name;
                entity.MEDIAS.FirstOrDefault().URL = url;
                entity.MEDIAS.FirstOrDefault().IMAGE = image;

                _eventsRepo.Edit(entity);
            }
            _eventsRepo.Commit();
        }
    }
}
