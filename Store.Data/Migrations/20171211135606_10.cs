using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Store.Data.Migrations
{
    public partial class _10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MENU",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BANNER_IMAGE = table.Column<byte[]>(nullable: true),
                    NAME = table.Column<string>(nullable: true),
                    PDF_CONTENT = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MENU", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "MENU_ITEMS",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DESCRIPTION = table.Column<string>(nullable: true),
                    IMAGE = table.Column<byte[]>(nullable: true),
                    MENU_ID = table.Column<int>(nullable: false),
                    NAME = table.Column<string>(nullable: true),
                    PRICE = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MENU_ITEMS", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MENU_ITEMS_MENU_MENU_ID",
                        column: x => x.MENU_ID,
                        principalTable: "MENU",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MENU_ITEMS_MENU_ID",
                table: "MENU_ITEMS",
                column: "MENU_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MENU_ITEMS");

            migrationBuilder.DropTable(
                name: "MENU");
        }
    }
}
