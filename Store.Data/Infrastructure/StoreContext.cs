using Microsoft.EntityFrameworkCore;
using Store.Data.DataEntities;

namespace Store.Data.Infrastructure
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }
        
        public virtual void Commit()
        {
            SaveChanges();
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {

        }

        public DbSet<TblSlide> SLIDES { get; set; }
        public DbSet<TblError> ERRORS { get; set; }
        public DbSet<TblEvent> EVENTS { get; set; }
        public DbSet<TblMedia> MEDIAS { get; set; }
        public DbSet<TblDish> MENU_ITEMS { get; set; }
        public DbSet<TblMenu> MENUS { get; set; }
        public DbSet<TblSlot> SLOTS { get; set; }
        public DbSet<TblBooking> BOOKINGS { get; set; }

    }

}




