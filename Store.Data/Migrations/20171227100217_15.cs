using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Store.Data.Migrations
{
    public partial class _15 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DATES",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DATES", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "SLOTS",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DATE_ID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SLOTS", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SLOTS_DATES_DATE_ID",
                        column: x => x.DATE_ID,
                        principalTable: "DATES",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BOOKINGS",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    NAME = table.Column<string>(nullable: true),
                    PHONE = table.Column<string>(nullable: true),
                    QUANTITY = table.Column<int>(nullable: false),
                    SLOT_ID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BOOKINGS", x => x.ID);
                    table.ForeignKey(
                        name: "FK_BOOKINGS_SLOTS_SLOT_ID",
                        column: x => x.SLOT_ID,
                        principalTable: "SLOTS",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BOOKINGS_SLOT_ID",
                table: "BOOKINGS",
                column: "SLOT_ID");

            migrationBuilder.CreateIndex(
                name: "IX_SLOTS_DATE_ID",
                table: "SLOTS",
                column: "DATE_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BOOKINGS");

            migrationBuilder.DropTable(
                name: "SLOTS");

            migrationBuilder.DropTable(
                name: "DATES");
        }
    }
}
