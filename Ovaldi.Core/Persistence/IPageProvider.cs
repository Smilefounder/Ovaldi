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

namespace Ovaldi.Core.Persistence
{
    public interface IPageProvider : IProvider<Page>
    {
        /// <summary>
        /// 站点内的所有页面，包括所有的子页面都在一个集合内
        /// </summary>
        /// <param name="site"></param>
        /// <returns></returns>
        IEnumerable<Page> All(Site site);
        IEnumerable<Page> RootPages(Site site);
        IEnumerable<Page> ChildPages(Page parentPage);

        //Page GetDraft(Page page);

        //void SaveAsDraft(Page page);

        //void RemoveDraft(Page page);

    }
}
