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
    public class PreExecutePageEventArgs : EventArgs
    {
        public PreExecutePageEventArgs(Page_Context page_context)
        {
            this.Page_Context = page_context;
        }

        public Page_Context Page_Context { get; private set; }

        //public ActionResult ActionResult { get; set; }
    }
}
