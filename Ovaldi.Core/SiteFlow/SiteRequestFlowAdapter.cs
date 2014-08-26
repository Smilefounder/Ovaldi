#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using Ovaldi.Core.SiteFlow.Args;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow
{
    public class SiteRequestFlowAdapter
    {
        #region .ctor
        ISiteRequestFlow _siteRequestFlow;
        ISiteRequestFlowEvents[] _events;
        public SiteRequestFlowAdapter(ISiteRequestFlow siteRequestFlow, ISiteRequestFlowEvents[] events)
        {
            Contract.Requires(siteRequestFlow != null);
            _siteRequestFlow = siteRequestFlow;
            _events = events ?? new ISiteRequestFlowEvents[0];
        }
        #endregion

        #region Properties
        public ISiteRequestFlow SiteRequestFlow
        {
            get { return _siteRequestFlow; }
        }
        public ISiteRequestFlowEvents[] EventHandlers
        {
            get { return _events; }
        }
        #endregion

        #region Methods


        /// <summary>
        /// 根据当前的请求地址，查找对应的站点。
        /// 1. 预览模式   dev~ + 站点名称
        /// 2. 正式访问   域名 + site path
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        /// <returns></returns>
        public SiteMappedContext MapSite(HttpContext httpContext)
        {
            Contract.Requires(httpContext != null);
            foreach (var item in _events)
            {
                item.PreMapSite(this, new PreMapSiteEventArgs(httpContext));
            }

            var mappedContext = _siteRequestFlow.MapSite(httpContext);

            foreach (var item in _events)
            {
                var args = new PostMapSiteEventArgs(httpContext, mappedContext);
                item.PostMapSite(this, args);
                //替换事件中可能重新查找的站点。
                mappedContext = args.MappedContext;
            }

            return mappedContext;
        }

        /// <summary>
        /// 根据需要创建一个自定义的HttpContext
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        /// <returns></returns>
        public HttpContextBase RenewHttpContext(HttpContext httpContext, SiteMappedContext siteMappedContext)
        {
            Contract.Requires(httpContext != null);
            foreach (var item in _events)
            {
                item.BeginSiteRequest(this, new BeginSiteRequestEventArgs(httpContext, siteMappedContext));
            }
            var newHttpContext = _siteRequestFlow.RenewHttpContext(httpContext, siteMappedContext);
            return newHttpContext;
        }

        /// <summary>
        /// 查找处理请求的Handler
        /// 比如：PageRequestHandler
        /// </summary>
        /// <param name="controllerContext">The HTTP context.</param>
        /// <returns></returns>
        public IRequestHandler MapRequestHandler(ControllerContext controllerContext, SiteMappedContext siteMappedContext)
        {
            Contract.Requires(controllerContext != null);
            Contract.Requires(siteMappedContext != null);

            foreach (var item in _events)
            {
                item.PreMapRequestHandler(this, new PreMapRequestHandlerEventArgs(controllerContext, siteMappedContext));
            }

            var requestHandler = _siteRequestFlow.MapRequestHandler(controllerContext, siteMappedContext);

            foreach (var item in _events)
            {
                item.PostMapRequestHandler(this, new PostMapRequestHandlerEventArgs(controllerContext, siteMappedContext, requestHandler));
            }
            return requestHandler;
        }

        /// <summary>
        /// 执行Handler
        /// </summary>
        /// <param name="controllerContext">The HTTP context.</param>
        public void ExecuteRequestHandler(ControllerContext controllerContext, SiteMappedContext siteMappedContext, IRequestHandler requestHandler)
        {
            Contract.Requires(controllerContext != null);
            Contract.Requires(siteMappedContext != null);
            Contract.Requires(requestHandler != null);

            foreach (var item in _events)
            {
                item.PreExecuteRequestHandler(this, new PreExecuteRequestHandlerEventArgs(controllerContext, siteMappedContext, requestHandler));
            }

            _siteRequestFlow.ExecuteRequestHandler(controllerContext, requestHandler, siteMappedContext);

            foreach (var item in _events)
            {
                var args = new PostExecuteRequestHandlerEventArgs(controllerContext, siteMappedContext, requestHandler);
                item.PostExecuteRequestHandler(this, args);
            }
        }

        /// <summary>
        /// 站点请求结束
        /// </summary>
        /// <param name="httpContext"></param>
        public void EndSiteRequest(HttpContextBase httpContext, SiteMappedContext siteMappedContext)
        {
            Contract.Requires(httpContext != null);
            Contract.Requires(siteMappedContext != null);

            foreach (var item in _events)
            {
                item.EndSiteRequest(this, new EndSiteRequestEventArgs(httpContext, siteMappedContext));
            }

            _siteRequestFlow.EndSiteRequest(httpContext, siteMappedContext);
        }

        /// <summary>
        /// Handle the exception
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        /// <param name="site">The site.</param>
        /// <param name="exception">The exception.</param>
        public bool Error(ControllerContext controllerContext, SiteMappedContext siteMappedContext, Exception exception)
        {
            Contract.Requires(controllerContext != null);
            Contract.Requires(exception != null);
            var handled = false;
            foreach (var item in _events)
            {
                var args = new ErrorEventArgs(controllerContext, siteMappedContext, exception);
                item.Error(this, args);
                if (args.ExceptionHandled == true)
                {
                    break;
                }
            }
            return handled;
        }
        #endregion
    }
}
