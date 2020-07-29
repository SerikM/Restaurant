using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Store.Data.DataEntities
{
    public class TblEvent : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public string NAME { get; set; }
        public string DESCRIPTION { get; set; }
        public DateTime ? DATE { get; set; }
        public virtual ICollection<TblMedia> MEDIAS { get; set; }
    }

    public class TblMedia : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public Byte[] IMAGE { get; set; }
        public string URL { get; set; }

        [ForeignKey("TBL_EVENT")]
        public int EVENT_ID { get; set; }
        public TblEvent TBL_EVENT { get; set; }
    }
}
