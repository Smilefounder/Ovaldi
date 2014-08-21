#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.Data.IsolatedStorage;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence.FileSystem.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem
{
    [Kooboo.Common.ObjectContainer.Dependency.DependencyAttribute(typeof(IPageProvider))]
    [Kooboo.Common.ObjectContainer.Dependency.DependencyAttribute(typeof(IProvider<Page>))]
    public class PageProvider : SiteObjectProviderBase<Page>, IPageProvider
    {
        #region .ctor
        static System.Threading.ReaderWriterLockSlim _lock = new System.Threading.ReaderWriterLockSlim();
        IBaseDir _baseDir = null;
        public PageProvider(IBaseDir baseDir)
        {
            _baseDir = baseDir;
        }
        #endregion

        #region GetFileStorage
        protected override Storage.IFileStorage<Page> GetFileStorage(Site site)
        {
            IIsolatedStorage isolatedStorage = site.GetIsolatedStorage(_baseDir);

            var directoryStorage = new DirectoryObjectFileStorage<Page>(isolatedStorage, "Pages", _lock, new Type[0], (name) =>
            {
                return new Page(site, name);
            });
            return directoryStorage;
        }

        #endregion

        #region All
        public IEnumerable<Page> All(Site site)
        {
            List<Page> allPages = new List<Page>();

            foreach (var page in RootPages(site))
            {
                AddPageAndItsChildPages(page, ref allPages);
            }
            return allPages;
        }
        private void AddPageAndItsChildPages(Page page, ref List<Page> pages)
        {
            pages.Add(page);
            foreach (var item in ChildPages(page))
            {
                AddPageAndItsChildPages(item, ref pages);
            }
        }
        #endregion

        #region RootPages
        public IEnumerable<Page> RootPages(Site site)
        {
            return RootItems(site);
        }
        #endregion

        #region ChildPages
        public IEnumerable<Page> ChildPages(Page parentPage)
        {
            return GetFileStorage(parentPage.Site).GetList(parentPage.AbsoluteName);
        }

        #endregion
        /// <summary>
        /// 所有站点的所有页面，目前没有实现。
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Page> All()
        {
            throw new NotImplementedException();
        }
    }
}
