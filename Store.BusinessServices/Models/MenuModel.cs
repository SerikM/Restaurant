using Store.Data.DataEntities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Store.BusinessServices.DTOs
{
    public class MenuModel
    {
        public int ID { get; set; }
        public string NAME { get; set; }
        public Byte[] PDF { get; set; }
        public Byte[] BANNER { get; set; }
        public ICollection<TblDish> ITEMS { get; set; }
    }
}










