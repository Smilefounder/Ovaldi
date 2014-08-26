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
using System.Web;

namespace Ovaldi.Core.SiteFlow.Args
{
    public class PostMapSiteEventArgs
    {
        /// <summary>
        /// Pres the map site event arguments.
        /// </summary>
        /// <param name="httpContext">The HTTP context.</param>
        public PostMapSiteEventArgs(HttpContext httpContext, SiteMappedContext mappedContext)            
        {
            this.HttpContext = httpContext;
            this.MappedContext = mappedContext;
        }
        public HttpContext HttpContext { get; private set; }
        /// <summary>
        /// Site对象运行被替换。
        /// 用于：A/B Site test
        /// </summary>
        /// <value>
        /// The site.
        /// </value>
        public SiteMappedContext MappedContext { get; set; }
    }
}
