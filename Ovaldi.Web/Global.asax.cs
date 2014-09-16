using Kooboo.Common.Web.Metadata;
using Ovaldi.Web.Areas.Import;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Ovaldi.Web
{
    public class MvcApplication : Kooboo.Common.Web.HttpApplicationEx
    {
        public override void Application_Start(object sender, EventArgs e)
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);



            ModelMetadataProviders.Current = new KoobooDataAnnotationsModelMetadataProvider();
            ModelValidatorProviders.Providers.RemoveAt(0);
            ModelValidatorProviders.Providers.Insert(0, new KoobooDataAnnotationsModelValidatorProvider());

            base.Application_Start(sender, e);
        }
    }
}
