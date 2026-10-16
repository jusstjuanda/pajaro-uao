// Aves UAO: guía de avistamiento en Realidad Aumentada de las aves del campus UAO.
// Sitio estático (HTML, CSS y JavaScript en wwwroot) servido con ASP.NET Core.
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();   // sirve wwwroot/index.html en "/"
app.UseStaticFiles(new StaticFileOptions
{
    // siempre revalidar: así el celular recibe la última versión de la app
    OnPrepareResponse = ctx => ctx.Context.Response.Headers.CacheControl = "no-cache"
});

app.Run();
