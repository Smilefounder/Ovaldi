#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using Kooboo.Common.Web;
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
    [Dependency(typeof(IFrontPageService))]
    public class FrontPageService : IFrontPageService
    {
        #region .ctor
        IPageProvider _pageProvider;
        public FrontPageService(IPageProvider pageProvider)
        {
            this._pageProvider = pageProvider;
        }
        #endregion
        public Page GetDefaultPage(Site site)
        {
            var allPages = _pageProvider.All(site);

            return allPages.Where(it => it.IsDefault == true).FirstOrDefault();
        }

        public PageMappedContext MapPage(System.Web.HttpContextBase httpContext, SiteMappedContext siteMappedContext)
        {
            string matchedPath = null;
            string queryStringPath = null;
            PageRoute matchedRoute;
            var url = siteMappedContext.RequestUrl;

            Page page;
            if (string.IsNullOrEmpty(url) || url == "/")
            {
                page = GetDefaultPage(siteMappedContext.Site);
                matchedPath = "/";
                matchedRoute = page.Routes == null ? null : page.Routes.FirstOrDefault();
                queryStringPath = "";
            }
            else
            {
                string[] paths = url.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

                var allPages = _pageProvider.All(siteMappedContext.Site);

                page = MatchPage(allPages, paths, out matchedPath, out matchedRoute);
                if (page != null)
                {
                    queryStringPath = url.Remove(0, matchedPath.Length).Trim('/');
                }
            }
            if (page != null)
            {

                return new PageMappedContext(page, matchedRoute, matchedPath, queryStringPath);
            }
            return null;
        }

        private Page MatchPage(IEnumerable<Page> allPages, string[] pagePaths, out string matchedPath, out PageRoute matchedRoute)
        {
            Page page = null;
            Page previousPage = null;
            matchedPath = null;
            matchedRoute = null;
            for (int i = 1; i <= pagePaths.Length; i++)
            {
                var paths = pagePaths.Take(i).ToArray();
                var currentPath = "/" + UrlUtility.Combine(pagePaths);

                foreach (var item in allPages)
                {
                    if (IsMatch(item, currentPath, out matchedRoute))
                    {
                        page = item;
                        break;
                    }
                }
                if (page == null)
                {
                    if (previousPage != null)
                    {
                        break;
                    }
                }
                else
                {
                    previousPage = page;
                    matchedPath = currentPath;
                }
            }
            if (previousPage != null)
            {
                previousPage = _pageProvider.Get(previousPage);
            }
            return previousPage;
        }

        private bool IsMatch(Page page, string path, out PageRoute matchedRoute)
        {
            matchedRoute = null;
            if (page.Routes == null || page.Routes.Length == 0)
            {
                return page.GetVirtualPath(null).Equals(path, StringComparison.OrdinalIgnoreCase);
            }
            else
            {
                foreach (var pageRoute in page.Routes)
                {
                    var virtualPath = page.GetVirtualPath(pageRoute);

                    if (virtualPath.Equals(path, StringComparison.OrdinalIgnoreCase))
                    {
                        matchedRoute = pageRoute;
                        return true;
                    }
                }
            }
            return false;
        }

    }
}
