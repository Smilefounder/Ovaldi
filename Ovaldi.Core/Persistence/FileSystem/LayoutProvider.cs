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
    [Kooboo.Common.ObjectContainer.Dependency.DependencyAttribute(typeof(ILayoutProvider))]
    [Kooboo.Common.ObjectContainer.Dependency.DependencyAttribute(typeof(IProvider<Layout>))]
    public class LayoutProvider : SiteObjectProviderBase<Layout>, ILayoutProvider
    {
        #region ctor

        static System.Threading.ReaderWriterLockSlim _lock = new System.Threading.ReaderWriterLockSlim();
        IBaseDir _baseDir = null;
        public LayoutProvider(IBaseDir baseDir)
        {
            _baseDir = baseDir;
        }
        #endregion

        #region GetFileStorage
        protected override Storage.IFileStorage<Layout> GetFileStorage(Site site)
        {
            IIsolatedStorage isolatedStorage = site.GetIsolatedStorage(_baseDir);

            var directoryStorage = new DirectoryObjectFileStorage<Layout>(isolatedStorage, "Templates/Layouts", _lock, new Type[0], (name) =>
            {
                return new Layout(site, name);
            });
            return directoryStorage;
        }

        #endregion

        public IEnumerable<Layout> All(Site site)
        {
            return RootItems(site);
        }

        /// <summary>
        /// 所有站点的所有Layout
        /// 暂时没有实现
        /// </summary>
        /// <returns></returns>
        IEnumerable<Layout> IProvider<Layout>.All()
        {
            throw new NotImplementedException();
        }
    }
}
