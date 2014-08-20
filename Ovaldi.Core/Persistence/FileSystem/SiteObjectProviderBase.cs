﻿#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence.FileSystem.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem
{
    public abstract class SiteObjectProviderBase<T>
        where T : ISiteObject, new()
    {
        protected abstract IFileStorage<T> GetFileStorage(Site site);


        #region All
        public virtual IEnumerable<T> RootItems(Site site)
        {
            var fileStorage = GetFileStorage(site);

            var list = fileStorage.GetList().ToArray();

            return list;
        }

        #endregion

        #region Get
        public virtual T Get(T dummy)
        {
            var fileStorage = GetFileStorage(dummy.Site);

            return fileStorage.Get(dummy);
        }
        #endregion

        #region Add
        public virtual void Add(T item)
        {
            var fileStorage = GetFileStorage(item.Site);

            fileStorage.Add(item);
        }
        #endregion

        #region Update
        public virtual void Update(T @new, T old)
        {
            var fileStorage = GetFileStorage(@new.Site);

            fileStorage.Update(@new, old);
        }
        #endregion

        #region Remove
        public virtual void Remove(T item)
        {
            var fileStorage = GetFileStorage(item.Site);

            fileStorage.Remove(item);
        }
        #endregion
    }
}
