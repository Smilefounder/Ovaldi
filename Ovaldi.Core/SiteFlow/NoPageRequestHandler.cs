#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common;
using Ovaldi.Core.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow
{
    public class NoPageRequestHandler : IRequestHandler
    {
        ControllerContext _controllerContext;
        SiteMappedContext _siteMappedContext;
        ISiteFileProvider _siteFileProvider;
        public NoPageRequestHandler(ControllerContext controllerContext, SiteMappedContext siteMappedContext, ISiteFileProvider siteFileProvider)
        {
            this._controllerContext = controllerContext;
            this._siteMappedContext = siteMappedContext;
            this._siteFileProvider = siteFileProvider;
        }
        public void ExecuteRequest()
        {
            ///AppRelativeCurrentExecutionFilePath start with ~/
            var requestUrl = this._controllerContext.HttpContext.Request.AppRelativeCurrentExecutionFilePath.Substring(2);

            if (!string.IsNullOrEmpty(requestUrl))
            {
                if (_siteFileProvider.IsFileExists(_siteMappedContext.Site, requestUrl))
                {
                    var fileData = _siteFileProvider.GetFileData(_siteMappedContext.Site, requestUrl);

                    _controllerContext.HttpContext.Response.OutputStream.Write(fileData, 0, fileData.Length);

                    return;
                }
            }
            throw new HttpException(404, string.Format(SR.GetString("Path_not_found"), new object[] { _controllerContext.HttpContext.Request.Path }));

        }
    }
}
