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
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow.Args
{
    public class PostExecuteRequestHandlerEventArgs
    {
        public PostExecuteRequestHandlerEventArgs(ControllerContext controllerContext, SiteMappedContext siteMappedContext, IRequestHandler requestHandler)
        {
            ControllerContext = controllerContext;
            this.SiteMappedContext = siteMappedContext;
            this.RequestHandler = requestHandler;
        }
        public ControllerContext ControllerContext { get; private set; }
        /// <summary>
        /// Gets the site.
        /// </summary>
        /// <value>
        /// The site.
        /// </value>
        public SiteMappedContext SiteMappedContext { get; private set; }

        /// <summary>
        /// Gets the request handler.
        /// </summary>
        /// <value>
        /// The request handler.
        /// </value>
        public IRequestHandler RequestHandler { get; private set; }
    }
}
