#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion

using Ovaldi.Core.SiteFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Ovaldi.Core.SiteFlow.Context
{
    public class FrontHttpContextWrapper : System.Web.HttpContextWrapper
    {
        private readonly HttpContext _context;

        public FrontHttpContextWrapper(HttpContext httpContext, SiteMappedContext siteMappedContext)
            : base(httpContext)
        {
            _context = httpContext;

            this._request = new FrontHttpRequestWrapper(httpContext.Request, siteMappedContext);
        }
        public SiteMappedContext SiteMappedContext { get; private set; }

        FrontHttpRequestWrapper _request;
        public override HttpRequestBase Request
        {
            get
            {
                return this._request;
            }
        }

        public override HttpResponseBase Response
        {
            get
            {
                return new FrontHttpResponseWrapper(_context.Response, this);
            }
        }

        public FrontHttpRequestWrapper RequestWrapper
        {
            get
            {
                return (FrontHttpRequestWrapper)this.Request;
            }
        }
        public FrontHttpResponseWrapper ResponseWrapper
        {
            get
            {
                return (FrontHttpResponseWrapper)this.Response;
            }
        }
    }
}
