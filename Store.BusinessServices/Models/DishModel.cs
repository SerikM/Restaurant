using System;
using System.Collections.Generic;
using System.Text;

namespace Store.BusinessServices.Models
{
    public class DishModel
    {
        public int dishId { get; set; }
        public string name { get; set; }
        public bool isSpecial { get; set; }
        public string description { get; set; }
        public double price { get; set; }
        public int menuId { get; set; }
    }
}










