using Store.Data.DataEntities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Store.BusinessServices.DTOs
{
    public class EventModel
    {
        public int ID { get; set; }
        public string NAME { get; set; }
        public string DESCRIPTION { get; set; }
        public ICollection<TblMedia> MEDIAS { get; set; }
    }
}
