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
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow.Args
{
    public class ErrorEventArgs
    {
        public ErrorEventArgs(ControllerContext controllerContext, Site site, Exception e)
        {
            this.ControllerContext = controllerContext;
            this.Site = site;
            this.Exception = e;
        }
        public ControllerContext ControllerContext { get; private set; }
        /// <summary>
        /// Gets the site.
        /// </summary>
        /// <value>
        /// The site.
        /// </value>
        public Site Site { get; private set; }

        /// <summary>
        /// Gets the exception.
        /// </summary>
        /// <value>
        /// The exception.
        /// </value>
        public Exception Exception { get; private set; }

        /// <summary>
        /// Gets or sets a value indicating whether [exception handled].
        /// 如果异常处理过，不希望后续流程再处理，设置ExceptionHandled = true;
        /// </summary>
        /// <value>
        ///   <c>true</c> if [exception handled]; otherwise, <c>false</c>.
        /// </value>
        public bool ExceptionHandled { get; set; }
    }
}
