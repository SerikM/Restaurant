using Microsoft.Extensions.Configuration;
using Store.BusinessServices.DTOs;
using Store.BusinessServices.Interfaces;
using Store.BusinessServices.Models;
using Store.Data.DataEntities;
using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Store.BusinessServices.Implements
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configurationlService;
        private readonly IBaseRepository<TblError> _errorRepo;


        public EmailService(
            IConfiguration configurationService, 
            IBaseRepository<TblError> errorRepo)
        {
            _configurationlService = configurationService;
            _errorRepo = errorRepo;

        }


        public void SendMail(ReserveModel model)
        {
            try
            {
            var smtpServer = _configurationlService.GetSection("AppSettings")["smtpServer"];
            var userName = _configurationlService.GetSection("AppSettings")["userName"];
            var password = _configurationlService.GetSection("AppSettings")["password"];
            var fromAddr = _configurationlService.GetSection("AppSettings")["fromAddr"];

            SmtpClient client = new SmtpClient(smtpServer);
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(userName, password);
                client.EnableSsl = true;

            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(fromAddr);
            mailMessage.To.Add(model.email);
            mailMessage.To.Add(fromAddr);
            mailMessage.ReplyToList.Add(new MailAddress(fromAddr));
            mailMessage.IsBodyHtml = true;

            mailMessage.Body = model.emailMessage;
            mailMessage.Subject = model.emailSubject;
            client.Send(mailMessage);
            }
            catch (Exception exc)
            {
                _errorRepo.Add(
                    new TblError
                    {
                        StackTrace = exc.StackTrace,
                        Message = exc.Message
                    });
            }
        }
    }
}
