using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Store.Data.Migrations
{
    public partial class _11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MENU_ITEMS_MENU_MENU_ID",
                table: "MENU_ITEMS");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MENU",
                table: "MENU");

            migrationBuilder.RenameTable(
                name: "MENU",
                newName: "MENUS");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MENUS",
                table: "MENUS",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_MENU_ITEMS_MENUS_MENU_ID",
                table: "MENU_ITEMS",
                column: "MENU_ID",
                principalTable: "MENUS",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MENU_ITEMS_MENUS_MENU_ID",
                table: "MENU_ITEMS");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MENUS",
                table: "MENUS");

            migrationBuilder.RenameTable(
                name: "MENUS",
                newName: "MENU");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MENU",
                table: "MENU",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_MENU_ITEMS_MENU_MENU_ID",
                table: "MENU_ITEMS",
                column: "MENU_ID",
                principalTable: "MENU",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
