#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core
{
    public enum FrontRequestChannel
    {
        Unknown,
        /// <summary>
        /// s~site1
        /// </summary>
        Preview,
        /// <summary>
        /// www.site1.com
        /// </summary>
        Host,
        ///// <summary>
        ///// www.kooboo.com/site1
        /// HostNPath 几乎没有用到的场景，用HOST+站点有没有带Binding的SitePath就可以判断了。
        ///// </summary>
        //HostNPath,
        /// <summary>
        /// 
        /// </summary>
        Design,
        Draft
    }
}
