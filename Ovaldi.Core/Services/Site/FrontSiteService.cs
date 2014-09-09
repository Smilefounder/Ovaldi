#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence;
using Ovaldi.Core.SiteFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Services
{
    [Dependency(typeof(IFrontSiteService))]
    public class FrontSiteService : IFrontSiteService
    {
        ISiteProvider _siteProvider;
        public FrontSiteService(ISiteProvider siteProvider)
        {
            this._siteProvider = siteProvider;
        }
        public SiteMappedContext MapSite(System.Web.HttpRequest httpRequest)
        {
            //start with ~/
            var appRelativeCurrentExecutionFilePath = httpRequest.AppRelativeCurrentExecutionFilePath;
            //trim "~/"
            var trimedPath = appRelativeCurrentExecutionFilePath.Substring(2);
            if (trimedPath.StartsWith(SiteExtensions.PREFIX_FRONT_PREVIEW_URL, StringComparison.OrdinalIgnoreCase))
            {
                return PreviewMap(httpRequest, trimedPath);
            }
            else
            {

            }
            return null;
        }

        private SiteMappedContext PreviewMap(System.Web.HttpRequest httpRequest, string requestPath)
        {
            var paths = requestPath.Split('/');
            var siteName = paths[0].Substring(SiteExtensions.PREFIX_FRONT_PREVIEW_URL.Count());

            var site = _siteProvider.Get(new Site(siteName));
            if (site != null)
            {

                var requestUrl = Kooboo.Common.Web.UrlUtility.Combine(new[] { "/" }.Concat(paths.Skip(1)).ToArray());
                if (httpRequest.Path.EndsWith("/") && !requestUrl.EndsWith("/"))
                {
                    requestUrl = requestUrl + "/";
                }
                var appRelativeCurrentExecutionFilePath = "~" + requestUrl;

                return new SiteMappedContext(site, null, FrontRequestChannel.Preview, requestUrl, appRelativeCurrentExecutionFilePath);
            }

            return null;
        }
    }
}
