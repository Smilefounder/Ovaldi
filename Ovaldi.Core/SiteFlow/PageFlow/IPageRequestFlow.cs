#region License
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
using System.Web;
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow
{
    /// <summary>
    /// 封装页面的执行流程
    /// 默认实现的执行顺序可以根据不同的需要，通过重写ExecutePage达到修改的目的。
    /// 也可以根据需要加入自己需要执行的动作。
    /// </summary>
    public interface IPageRequestFlow
    {
        /// <summary>
        /// 查找页面
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="siteMappedContext">The site.</param>
        /// <returns></returns>
        PageMappedContext MapPage(ControllerContext controllerContext, SiteMappedContext siteMappedContext);

        /// <summary>
        /// 创建Page_Context
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="site">The site.</param>
        /// <param name="PageMappedContext">The page mapped context.</param>
        /// <returns></returns>
        Page_Context CreatePageContext(ControllerContext controllerContext, SiteMappedContext siteMappedContext, PageMappedContext mappedContext);

        /// <summary>
        /// 执行页面逻辑
        /// </summary>
        ActionResult ExecutePage(Page_Context page_context);

        /// <summary>
        /// 渲染输出页面
        /// </summary>
        void RenderPage(Page_Context page_context, ActionResult actionResult);

        /// <summary>
        /// 结束页面请求
        /// </summary>
        /// <param name="page_Context"></param>
        void EndPageRequest(Page_Context page_context);

        //void ExecutePlugins();
        //void ExecuteDataRules();
        //void InitializeHtmlMeta();
        //void ExecuteModuleAction();
    }
}
