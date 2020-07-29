using Store.Data.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;

namespace Store.Data.DataEntities
{
    public class TblError : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public string Message { get; set; }
        public string StackTrace { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
