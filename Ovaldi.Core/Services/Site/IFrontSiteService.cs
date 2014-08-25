#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using Ovaldi.Core.SiteFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Ovaldi.Core.Services
{
    public interface IFrontSiteService
    {
        SiteMappedContext MapSite(HttpRequestBase httpRequest);
    }
}
