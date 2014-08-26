#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common;
using Ovaldi.Core.Models;
using Ovaldi.Core.SiteFlow.Context;
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
    /// <summary>
    /// 处理页面请求
    /// </summary>
    public class PageRequestHandler : IRequestHandler
    {
        #region .ctor
        ControllerContext _controllerContext;
        SiteMappedContext _siteMappedContext;
        PageRequestFlowAdapter _pageRequestFlowAdapter;
        public PageRequestHandler(ControllerContext controllerContext, PageRequestFlowAdapter pageRequestFlowAdapter, SiteMappedContext siteMappedContext)
        {
            Contract.Requires(siteMappedContext != null);
            Contract.Requires(pageRequestFlowAdapter != null);

            this._controllerContext = controllerContext;
            this._siteMappedContext = siteMappedContext;
            this._pageRequestFlowAdapter = pageRequestFlowAdapter;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Executes the request.
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <exception cref="System.NotImplementedException"></exception>
        public void ExecuteRequest()
        {
            Contract.Requires(_controllerContext != null);

            try
            {
                var httpContextWrapper = (FrontHttpContextWrapper)_controllerContext.HttpContext;

                var pageMappedContext = _pageRequestFlowAdapter.MapPage(_controllerContext, this._siteMappedContext);

                if (pageMappedContext == null)
                {
                    throw new HttpException(0x194, string.Format(SR.GetString("Path_not_found"), new object[] { _controllerContext.HttpContext.Request.Path }));
                }

                var page_context = _pageRequestFlowAdapter.CreatePageContext(_controllerContext, _siteMappedContext, pageMappedContext);

                var actionResult = _pageRequestFlowAdapter.ExecutePage(page_context);

                _pageRequestFlowAdapter.RenderPage(page_context, actionResult);

                _pageRequestFlowAdapter.EndPageRequest(page_context);
            }
            catch (Exception e)
            {
                var handled = _pageRequestFlowAdapter.Error(_controllerContext, this._siteMappedContext, e);
                if (!handled)
                {
                    throw;
                }
            }

        }
        #endregion

    }
}
