using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Store.Data.Migrations
{
    public partial class _6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IMAGE",
                table: "EVENTS");

            migrationBuilder.DropColumn(
                name: "URL",
                table: "EVENTS");

            migrationBuilder.CreateTable(
                name: "MEDIAS",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EVENT_ID = table.Column<int>(nullable: false),
                    IMAGE = table.Column<byte[]>(nullable: true),
                    URL = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MEDIAS", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MEDIAS_EVENTS_EVENT_ID",
                        column: x => x.EVENT_ID,
                        principalTable: "EVENTS",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MEDIAS_EVENT_ID",
                table: "MEDIAS",
                column: "EVENT_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MEDIAS");

            migrationBuilder.AddColumn<byte[]>(
                name: "IMAGE",
                table: "EVENTS",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "URL",
                table: "EVENTS",
                nullable: true);
        }
    }
}
