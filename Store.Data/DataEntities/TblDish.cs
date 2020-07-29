using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Store.Data.DataEntities
{
    public class TblDish : IEntityBase
    {
        [Key]
        public int ID { get; set; }
        public string NAME { get; set; }
        public bool IS_SPECIAL { get; set; }
        public string DESCRIPTION { get; set; }
        public double PRICE { get; set; }
        public Byte[] IMAGE { get; set; }

        [ForeignKey("TBL_MENU")]
        public int MENU_ID { get; set; }
        public TblMenu TBL_MENU { get; set; }
    }
}
