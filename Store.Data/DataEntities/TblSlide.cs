using Store.Data.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;

namespace Store.Data.DataEntities
{
    public class TblSlide : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public Byte[] IMAGE { get; set; }
    }
}
