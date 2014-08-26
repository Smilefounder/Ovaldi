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

using Ovaldi.Core.Models;
using System.Web.Mvc;
namespace Ovaldi.Core.SiteFlow
{
    /// <summary>
    /// 定义站点请求的业务步骤，留出对应的事件可以各种特定逻辑的插入，以便更好的以模块式开发。
    /// </summary>
    public interface ISiteRequestFlow
    {
        /// <summary>
        /// 根据当前的请求地址，查找对应的站点。
        /// 1. 预览模式   dev~ + 站点名称
        /// 2. 正式访问   域名 + site path
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        /// <returns></returns>
        SiteMappedContext MapSite(HttpContext httpContext);

        /// <summary>
        /// 根据需要创建一个自定义的HttpContext
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        /// <returns></returns>
        HttpContextBase RenewHttpContext(HttpContext httpContext, SiteMappedContext siteMappContext);

        /// <summary>
        /// 查找处理请求的Handler
        /// 比如：PageRequestHandler
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <returns></returns>
        IRequestHandler MapRequestHandler(ControllerContext controllerContext, SiteMappedContext siteMappedContext);

        /// <summary>
        /// 执行Handler
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="requestHandler">The request handler.</param>
        void ExecuteRequestHandler(ControllerContext controllerContext, IRequestHandler requestHandler, SiteMappedContext siteMappedContext);

        /// <summary>
        /// 站点请求结束
        /// </summary>
        /// <param name="httpContext"></param>
        void EndSiteRequest(HttpContextBase httpContext, SiteMappedContext siteMappedContext);
    }
}
