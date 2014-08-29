using Kooboo.Common.ObjectContainer.Dependency;
using Kooboo.Common.Web.ObjectContainer.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovaldi.Web
{
    [Dependency(typeof(Kooboo.Common.Web.IHttpApplicationEvents), Key = "OvaldiHttpApplication")]
    public class OvaldiHttpApplication : MvcModule
    {
    }
}