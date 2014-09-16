using Kooboo.Common;
using Kooboo.Common.Web;
using System.IO;
using System.Web.Mvc;
using System.Web.Routing;

namespace Ovaldi.Web.Areas.Import
{
    public class ImportAreaRegistration : AreaRegistrationEx 
    {
        public override string AreaName 
        {
            get 
            {
                return "Import";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Import_default",
                "Import/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );

            Kooboo.Common.Web.WebResourceLoader.ConfigurationManager.RegisterSection(AreaName, Path.Combine(Settings.BaseDirectory, "Areas", AreaName, "WebResources.config"));

        }
    }
}