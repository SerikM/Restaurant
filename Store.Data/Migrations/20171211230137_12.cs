using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Store.Data.Migrations
{
    public partial class _12 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PDF_CONTENT",
                table: "MENUS",
                newName: "PDF");

            migrationBuilder.RenameColumn(
                name: "BANNER_IMAGE",
                table: "MENUS",
                newName: "BANNER");

            migrationBuilder.AddColumn<bool>(
                name: "IS_SPECIAL",
                table: "MENU_ITEMS",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IS_SPECIAL",
                table: "MENU_ITEMS");

            migrationBuilder.RenameColumn(
                name: "PDF",
                table: "MENUS",
                newName: "PDF_CONTENT");

            migrationBuilder.RenameColumn(
                name: "BANNER",
                table: "MENUS",
                newName: "BANNER_IMAGE");
        }
    }
}
