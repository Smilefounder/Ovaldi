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
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow.Args
{
    public class PreCreatePageContextEventArgs
    {
        public PreCreatePageContextEventArgs(ControllerContext controllerContext, SiteMappedContext siteMappedContext, PageMappedContext pageMappedContext)
        {
            this.ControllerContext = controllerContext;
            this.SiteMappedContext = siteMappedContext;
            this.PageMappedContext = pageMappedContext;
        }

        public ControllerContext ControllerContext { get; private set; }

        public SiteMappedContext SiteMappedContext { get; private set; }

        /// <summary>
        /// Gets or sets the page.
        /// Page对象可以被替换，用在A/B page test的场景里面。
        /// </summary>
        /// <value>
        /// The page.
        /// </value>
        public PageMappedContext PageMappedContext { get; set; }
    }
}
