using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Store.Data.Infrastructure;

namespace Store.Data.Migrations
{
    [DbContext(typeof(StoreContext))]
    [Migration("20171126094624_6")]
    partial class _6
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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

            modelBuilder.Entity("Store.Data.DataEntities.TblSlide", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("IMAGE");

                    b.HasKey("ID");

                    b.ToTable("SLIDES");
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
