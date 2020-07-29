using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Store.Data.Infrastructure;

namespace Store.Data.Migrations
{
    [DbContext(typeof(StoreContext))]
    [Migration("20171229003552_19")]
    partial class _19
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Store.Data.DataEntities.TblBooking", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("NAME");

                    b.Property<string>("PHONE");

                    b.Property<int>("QUANTITY");

                    b.Property<int>("SLOT_ID");

                    b.HasKey("ID");

                    b.HasIndex("SLOT_ID");

                    b.ToTable("BOOKINGS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblDish", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DESCRIPTION");

                    b.Property<byte[]>("IMAGE");

                    b.Property<bool>("IS_SPECIAL");

                    b.Property<int>("MENU_ID");

                    b.Property<string>("NAME");

                    b.Property<double>("PRICE");

                    b.HasKey("ID");

                    b.HasIndex("MENU_ID");

                    b.ToTable("MENU_ITEMS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblError", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateCreated");

                    b.Property<string>("Message");

                    b.Property<string>("StackTrace");

                    b.HasKey("ID");

                    b.ToTable("ERRORS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblEvent", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("DATE");

                    b.Property<string>("DESCRIPTION");

                    b.Property<string>("NAME");

                    b.HasKey("ID");

                    b.ToTable("EVENTS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblMedia", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("EVENT_ID");

                    b.Property<byte[]>("IMAGE");

                    b.Property<string>("URL");

                    b.HasKey("ID");

                    b.HasIndex("EVENT_ID");

                    b.ToTable("MEDIAS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblMenu", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("BANNER");

                    b.Property<string>("NAME");

                    b.Property<byte[]>("PDF");

                    b.HasKey("ID");

                    b.ToTable("MENUS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblSlide", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("IMAGE");

                    b.HasKey("ID");

                    b.ToTable("SLIDES");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblSlot", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CAPACITY");

                    b.Property<DateTime>("DATE");

                    b.Property<DateTime>("END_TIME");

                    b.Property<DateTime>("START_TIME");

                    b.HasKey("ID");

                    b.ToTable("SLOTS");
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblBooking", b =>
                {
                    b.HasOne("Store.Data.DataEntities.TblSlot", "SLOT")
                        .WithMany("BOOKINGS")
                        .HasForeignKey("SLOT_ID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblDish", b =>
                {
                    b.HasOne("Store.Data.DataEntities.TblMenu", "TBL_MENU")
                        .WithMany("ITEMS")
                        .HasForeignKey("MENU_ID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Store.Data.DataEntities.TblMedia", b =>
                {
                    b.HasOne("Store.Data.DataEntities.TblEvent", "TBL_EVENT")
                        .WithMany("MEDIAS")
                        .HasForeignKey("EVENT_ID")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
