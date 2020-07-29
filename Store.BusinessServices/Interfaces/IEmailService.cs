using Store.BusinessServices.DTOs;
using Store.BusinessServices.Models;
using Store.Data.DataEntities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Store.BusinessServices.Interfaces
{
    public interface IEmailService
    {
        void SendMail(ReserveModel modell);
    }
}
