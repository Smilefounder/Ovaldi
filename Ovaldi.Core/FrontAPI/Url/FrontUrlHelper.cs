﻿#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Routing;
using System.Web.Mvc;

namespace Ovaldi.Core.FrontAPI
{
    public class FrontUrlHelper : IFrontUrlHelper
    {
        #region .ctor
        public UrlHelper Url
        {
            get;
            private set;
        }

        public Site Site
        {
            get;
            private set;
        }

        public FrontRequestChannel RequestChannel
        {
            get;
            private set;
        }
        public FrontUrlHelper(UrlHelper urlHelper, Site site, FrontRequestChannel requestChannel)
        {
            this.Url = urlHelper;
            this.Site = site;
            this.RequestChannel = requestChannel;
        }
        #endregion

        public System.Web.IHtmlString WrapperUrl(string url)
        {
            throw new NotImplementedException();
        }

        public System.Web.IHtmlString WrapperUrl(string url, bool? requireSSL)
        {
            if (string.IsNullOrEmpty(url))
            {
                return new HtmlString(url);
            }
            var applicationPath = HttpContext.Current.Request.ApplicationPath.TrimStart(new char[] { '/' });
            if (!url.StartsWith("/") && !string.IsNullOrEmpty(applicationPath))
            {
                url = "/" + applicationPath + "/" + url;
            }


            var sitePath = "";// Site.AsActual().SitePath;
            if (RequestChannel == FrontRequestChannel.Preview || RequestChannel == FrontRequestChannel.Design || RequestChannel == FrontRequestChannel.Unknown)
            {
                sitePath = SiteExtensions.PREFIX_FRONT_PREVIEW_URL + Site.AbsoluteName;
            }
            var urlSplit = url.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            IEnumerable<string> urlPaths = urlSplit;
            if (!string.IsNullOrEmpty(sitePath))
            {
                if (urlSplit.Length > 0 && applicationPath.EqualsOrNullEmpty(urlSplit[0], StringComparison.OrdinalIgnoreCase))
                {
                    urlPaths = new string[] { applicationPath, sitePath }.Concat(urlSplit.Skip(1));
                }
                else
                {
                    urlPaths = new string[] { sitePath }.Concat(urlSplit);
                }
            }
            var endWithSlash = url.EndsWith("/");
            url = "/" + string.Join("/", urlPaths.ToArray());
            if (endWithSlash && !url.EndsWith("/"))
            {
                url = url + "/";
            }


            #region SSL
            if (requireSSL.HasValue)
            {
                if (RequestChannel == FrontRequestChannel.Host)
                {
                    if (HttpContext.Current.Request.IsSecureConnection)
                    {
                        //if (!requireSSL.Value)
                        //{
                        //    url = "http://" + HttpContext.Current.Request.Url.Host + url;
                        //}
                    }
                    else if (requireSSL.Value)
                    {
                        url = "https://" + HttpContext.Current.Request.Url.Host + url;
                    }
                }
            }


            #endregion

            return new HtmlString(url);
        }

        #region GeneratePageUrl
        public virtual IHtmlString GeneratePageUrl(string urlKey, object values, Func<Site, string, Page> findPage, out Page page)
        {
            var site = this.Site;

            page = new Page(site, urlKey).LastVersion(this.Site);
            if (page == null)
            {
                page = findPage(site, urlKey);
                string pageFullName = "";
                if (page != null)
                {
                    pageFullName = page.AbsoluteName;
                }
            }
            if (page != null)
            {
                var url = GeneratePageUrl(page, values);
                return url;
            }
            else
            {
                return new HtmlString("");
            }
        }

        public virtual IHtmlString GeneratePageUrl(Page page, object values)
        {
            return GeneratePageUrl(this.Url, this.Site, page, values, this.RequestChannel);
        }
        internal IHtmlString GeneratePageUrl(UrlHelper urlHelper, Site site, Page page, object values, FrontRequestChannel channel)
        {
            RouteValueDictionary routeValues = RouteValuesHelper.GetRouteValues(values);

            if (page == null)
            {
                return new HtmlString("");
            }
            var route = page.Routes == null ? null : page.Routes.FirstOrDefault();
            //if (route != null && !string.IsNullOrEmpty(route.ExternalUrl))
            //{
            //    return new HtmlString(route.ExternalUrl);
            //}

            var pageRoute = route.ToMvcRoute();

            routeValues = RouteValuesHelper.MergeRouteValues(pageRoute.Defaults, routeValues);

            var routeVirtualPath = pageRoute.GetVirtualPath(urlHelper.RequestContext, routeValues);
            if (routeVirtualPath == null)
            {
                Kooboo.Common.Logging.Logger.LoggerInstance.Warn(string.Format("Invalid page URL route. Page:{0}", page.AbsoluteName));
            }
            //string contentUrl = routeVirtualPath.VirtualPath;//don't decode the url. why??
            //if do not decode the url, the route values contains Chinese character will cause bad request.
            string contentUrl = HttpUtility.UrlDecode(routeVirtualPath.VirtualPath);
            string pageUrl = contentUrl;
            if (!string.IsNullOrEmpty(contentUrl) || (string.IsNullOrEmpty(pageUrl) && !page.IsDefault))
            {
                pageUrl = Kooboo.Common.Web.UrlUtility.Combine(page.GetVirtualPath(route), contentUrl);
            }
            if (string.IsNullOrEmpty(pageUrl))
            {
                pageUrl = urlHelper.Content("~/");
            }
            else
            {
                pageUrl = HttpUtility.UrlDecode(
                urlHelper.RouteUrl("Page", new { PageUrl = new HtmlString(pageUrl) }));
            }
            var url = this.WrapperUrl(pageUrl, page.RequireHttps);

            return url;
        }
        #endregion
    }
}
