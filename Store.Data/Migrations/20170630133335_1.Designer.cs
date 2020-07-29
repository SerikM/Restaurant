using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Store.Data.Infrastructure;

namespace Store.Data.Migrations
{
    [DbContext(typeof(StoreContext))]
    [Migration("20170630133335_1")]
    partial class _1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ModelSTD.DataEntities.TblError", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DateCreated");

                    b.Property<string>("Message");

                    b.Property<string>("StackTrace");

                    b.HasKey("ID");

                    b.ToTable("ERRORS");
                });

            modelBuilder.Entity("ModelSTD.DataEntities.TblSlide", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("IMAGE");

                    b.Property<string>("IMAGE_URL");

                    b.Property<string>("NAME");

                    b.HasKey("ID");

                    b.ToTable("SLIDES");
                });
        }
    }
}
