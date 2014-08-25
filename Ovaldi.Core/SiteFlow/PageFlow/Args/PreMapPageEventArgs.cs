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
    public class PreMapPageEventArgs : EventArgs
    {
        public PreMapPageEventArgs(ControllerContext controllerContext, SiteMappedContext siteMappedContext)
        {
            this.ControllerContext = controllerContext;
            this.SiteMappedContext = siteMappedContext;
        }
        public ControllerContext ControllerContext { get; private set; }
        public SiteMappedContext SiteMappedContext { get; private set; }


    }
}
