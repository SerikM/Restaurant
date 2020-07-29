using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Store.Data.DataEntities
{
    public class TblMenu : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public string NAME { get; set; }
        public Byte[] PDF { get; set; }
        public Byte[] BANNER { get; set; }
        public ICollection<TblDish> ITEMS { get; set; }
    }
}
