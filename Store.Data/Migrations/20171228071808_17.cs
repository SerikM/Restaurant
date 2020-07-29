using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Store.Data.Migrations
{
    public partial class _17 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Capacity",
                table: "SLOTS",
                newName: "CAPACITY");

            migrationBuilder.AddColumn<DateTime>(
                name: "END_TIME",
                table: "SLOTS",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "START_TIME",
                table: "SLOTS",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "END_TIME",
                table: "SLOTS");

            migrationBuilder.DropColumn(
                name: "START_TIME",
                table: "SLOTS");

            migrationBuilder.RenameColumn(
                name: "CAPACITY",
                table: "SLOTS",
                newName: "Capacity");
        }
    }
}
