using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Store.Data.DataEntities
{
    public class TblSlot : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public ICollection<TblBooking> BOOKINGS { get; set; }
        public int CAPACITY { get; set; }
        public DateTime START_TIME { get; set; }
        public DateTime END_TIME { get; set; }
        public DateTime DATE { get; set; }
    }
}
