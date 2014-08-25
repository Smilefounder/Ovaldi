#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Kooboo.Common.Globalization;
using System.Threading;
using System.Web.Mvc;
using System.Globalization;

using Kooboo.Common.Web;
using Kooboo.Common.Misc;
using Ovaldi.Core.Models;

namespace Ovaldi.Core.SiteFlow.Context
{
    public class FrontHttpRequestWrapper : System.Web.HttpRequestWrapper
    {
        #region .ctor
        private HttpRequest _request;
        private SiteRequestFlowAdapter _siteRequestFlowAdapter;
        public FrontHttpRequestWrapper(HttpRequest httpRequest, SiteRequestFlowAdapter siteRequestFlowAdapter)
            : base(httpRequest)
        {
            this._request = httpRequest;
            this._siteRequestFlowAdapter = siteRequestFlowAdapter;
            // 原始的AppRelativeCurrentExecutionFilePath
            appRelativeCurrentExecutionFilePath = httpRequest.AppRelativeCurrentExecutionFilePath;

            ResolveSite();
        }
        #endregion

        #region override
        string appRelativeCurrentExecutionFilePath;
        public override string AppRelativeCurrentExecutionFilePath
        {
            get
            {
                return appRelativeCurrentExecutionFilePath;
            }
        }

        public override bool IsSecureConnection
        {
            get
            {
                return IsSSL;
            }
        }
        #endregion

        #region Properties

        private Site _site;
        public Site Site
        {
            get
            {
                return _site;
            }
            private set
            {
                _site = value;
            }
        }

        public SiteMappedContext SiteMappedContext { get; private set; }

        private string _requestUrl = "";
        public string RequestUrl
        {
            get { return _requestUrl; }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    var queryQueryIndex = value.IndexOf("?");
                    if (queryQueryIndex > -1)
                    {
                        _requestUrl = value.Substring(0, queryQueryIndex);
                    }
                    else
                    {
                        _requestUrl = value;
                    }
                }
            }
        }

        #region IsSSL
        public virtual bool IsSSL
        {
            get
            {
                if (HttpContext.Current.Items["IsSSL"] == null)
                {
                    return HttpContext.Current.Request.IsSecureConnection;
                }
                else
                {
                    return (bool)HttpContext.Current.Items["IsSSL"];
                }
            }
            set
            {
                HttpContext.Current.Items["IsSSL"] = value;
            }
        }
        #endregion

        #endregion

        #region ResolveSite
        private static bool IgnoreResolveSite(string appRelativeCurrentExecutionFilePath)
        {
            return appRelativeCurrentExecutionFilePath.ToLower().Contains("/cms_data/");
        }


        internal void ResolveSite()
        {
            if (IgnoreResolveSite(appRelativeCurrentExecutionFilePath))
            {
                return;
            }
            if (!string.IsNullOrEmpty(this.PathInfo))
            {
                appRelativeCurrentExecutionFilePath = appRelativeCurrentExecutionFilePath.TrimEnd('/') + "/" + PathInfo;
            }

            SiteMappedContext = this._siteRequestFlowAdapter.MapSite(new HttpContextWrapper(HttpContext.Current));

            if (SiteMappedContext != null)
            {
                //trim "~/"
                var trimedPath = appRelativeCurrentExecutionFilePath.Substring(2);

                this.Site = SiteMappedContext.Site;

                if (SiteMappedContext.RequestChannel == FrontRequestChannel.Debug)
                {
                    //preview url
                    #region dev~
                    //dev~site1/index
                    var paths = trimedPath.Split('/');

                    RequestUrl = Kooboo.Common.Web.UrlUtility.Combine(new[] { "/" }.Concat(paths.Skip(1)).ToArray());
                    if (this.Path.EndsWith("/") && !this.RequestUrl.EndsWith("/"))
                    {
                        RequestUrl = RequestUrl + "/";
                    }
                    appRelativeCurrentExecutionFilePath = "~" + RequestUrl;
                    #endregion
                }
                else
                {
                    var sitePathLength = 0;

                    var path = trimedPath.Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                    RequestUrl = UrlUtility.Combine(new[] { "/" }.Concat(path.Skip(sitePathLength)).ToArray());
                    if (this.Path.EndsWith("/") && !this.RequestUrl.EndsWith("/"))
                    {
                        RequestUrl = RequestUrl + "/";
                    }
                    appRelativeCurrentExecutionFilePath = "~" + RequestUrl;
                }

                if (!string.IsNullOrEmpty(Site.Culture))
                {
                    var culture = CultureInfoHelper.CreateCultureInfo(Site.Culture);
                    Thread.CurrentThread.CurrentCulture = culture;
                    Thread.CurrentThread.CurrentUICulture = culture;
                }
            }
            
            //decode the request url. for chinese character
            this.RequestUrl = HttpUtility.UrlDecode(this.RequestUrl);
        }

        #endregion
    }
}
