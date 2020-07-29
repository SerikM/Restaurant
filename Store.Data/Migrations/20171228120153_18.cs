using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Store.Data.Migrations
{
    public partial class _18 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SLOTS_DATES_DATE_ID",
                table: "SLOTS");

            migrationBuilder.DropTable(
                name: "DATES");

            migrationBuilder.DropIndex(
                name: "IX_SLOTS_DATE_ID",
                table: "SLOTS");

            migrationBuilder.DropColumn(
                name: "DATE_ID",
                table: "SLOTS");

            migrationBuilder.AddColumn<DateTime>(
                name: "DATE",
                table: "SLOTS",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DATE",
                table: "SLOTS");

            migrationBuilder.AddColumn<int>(
                name: "DATE_ID",
                table: "SLOTS",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DATES",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Value = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DATES", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SLOTS_DATE_ID",
                table: "SLOTS",
                column: "DATE_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_SLOTS_DATES_DATE_ID",
                table: "SLOTS",
                column: "DATE_ID",
                principalTable: "DATES",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
