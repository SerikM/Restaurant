using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Store.Data.DataEntities
{
 
    public class TblBooking : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public string NAME { get; set; }
        public int QUANTITY { get; set; }
        public string PHONE { get; set; }
        public string EMAIL { get; set; }

        //foreign key details
        [ForeignKey("SLOT")]
        public int SLOT_ID { get; set; }
        public TblSlot SLOT { get; set; }

    }
}
