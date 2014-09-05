#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow
{
    public class NoSiteRequestHandler : IRequestHandler
    {
        ControllerContext _controllerContext;
        public NoSiteRequestHandler(ControllerContext controllerContext)
        {
            this._controllerContext = controllerContext;
        }
        public void ExecuteRequest()
        {
            throw new HttpException(404, string.Format(SR.GetString("Path_not_found"), new object[] { _controllerContext.HttpContext.Request.Path }));
        }
    }
}
