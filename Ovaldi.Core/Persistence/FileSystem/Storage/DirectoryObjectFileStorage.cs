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
using Ovaldi.Core.Persistence.FileSystem.Storage.DataContract;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem.Storage
{
    public class DirectoryObjectFileStorage<T> : IFileStorage<T>
         where T : IIdentifiable, new()
    {
        #region .ctor
        public string DataFileName = "setting.config";
        protected Kooboo.Common.Data.IsolatedStorage.IIsolatedStorage isolatedStorage;
        protected string rootPathInStorage;
        protected ReaderWriterLockSlim _lock;
        protected IEnumerable<Type> _knownTypes;
        protected Func<string, T> _initialize = (path) =>
        {
            var o = new T() { UUID = Path.GetFileName(path) };
            return o;
        };
        public DirectoryObjectFileStorage(IIsolatedStorage isolatedStorage, string rootPathInStorage, ReaderWriterLockSlim @lock)
            : this(isolatedStorage, rootPathInStorage, @lock, new Type[0])
        {
        }
        public DirectoryObjectFileStorage(IIsolatedStorage isolatedStorage, string rootPathInStorage, ReaderWriterLockSlim @lock, IEnumerable<Type> knownTypes)
            : this(isolatedStorage, rootPathInStorage, @lock, knownTypes, null)
        {
        }
        public DirectoryObjectFileStorage(IIsolatedStorage isolatedStorage, string rootPathInStorage, ReaderWriterLockSlim @lock, IEnumerable<Type> knownTypes, Func<string, T> initialize)
        {
            this.isolatedStorage = isolatedStorage;
            this.rootPathInStorage = rootPathInStorage;
            this._lock = @lock;
            this._knownTypes = knownTypes;
            if (initialize != null)
            {
                _initialize = initialize;
            }
        }

        #endregion

        #region GetList
        public IEnumerable<T> GetList(string parentItemName = null)
        {
            _lock.EnterReadLock();
            try
            {
                return Enumerate(parentItemName);
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }

        private IEnumerable<T> Enumerate(string parentItemName)
        {
            List<T> list = new List<T>();
            var relativePath = rootPathInStorage;
            if (!string.IsNullOrEmpty(parentItemName))
            {
                parentItemName = FullNameHelper.ToPathName(parentItemName);
                relativePath = Path.Combine(rootPathInStorage, parentItemName);
            }

            foreach (var item in isolatedStorage.GetDirectoryNames(relativePath))
            {
                var itemFullName = item;
                if (!string.IsNullOrEmpty(parentItemName))
                {
                    itemFullName = Path.Combine(parentItemName, item);
                }
                if (IsValidDataItem(Path.Combine(rootPathInStorage, itemFullName)))
                {
                    var o = _initialize(itemFullName);
                    //get object
                    o = Get(o);
                    if (o != null)
                    {
                        list.Add(o);
                    }
                }
            }
            return list;
        }
        protected virtual bool IsValidDataItem(string dirName)
        {
            var valid = !dirName.EqualsOrNullEmpty("~versions", StringComparison.OrdinalIgnoreCase);
            if (valid)
            {
                valid = isolatedStorage.FileExists(Path.Combine(dirName, DataFileName));
            }
            return valid;
        }
        #endregion

        #region Get
        public T Get(T dummy)
        {
            string filePath = GetDataFilePath(dummy);
            if (!this.isolatedStorage.FileExists(filePath))
            {
                return default(T);
            }
            _lock.EnterReadLock();
            try
            {
                var o = Deserialize(dummy, filePath);
                return o;
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }
        protected virtual string GetItemPath(T o)
        {
            return Path.Combine(rootPathInStorage, FullNameHelper.ToPathName(o.UUID));
        }
        protected virtual string GetDataFilePath(T o)
        {
            return Path.Combine(GetItemPath(o), DataFileName);
        }

        #endregion

        #region Serialization
        protected virtual T Deserialize(T dummy, string filePath)
        {
            using (var storageFileStream = isolatedStorage.OpenFile(filePath, FileMode.Open))
            {

                var o = (T)XmlSerialization.Deserialize(dummy.GetType(), storageFileStream.Stream, GetDataContractSerializerSettings());
                return o;

            }
        }
        protected virtual DataContractSerializerSettings GetDataContractSerializerSettings()
        {
            DataContractSerializerSettings settings = new DataContractSerializerSettings() { KnownTypes = this._knownTypes };

            settings.DataContractSurrogate = DataContractSurrogateHelper.GetDataContractSurrogate(typeof(T));

            return settings;

        }
        protected virtual void Serialize(T item, string filePath)
        {
            using (var memoryStream = new MemoryStream())
            {
                XmlSerialization.Serialize(item, memoryStream, GetDataContractSerializerSettings());

                if (isolatedStorage.FileExists(filePath))
                {
                    isolatedStorage.UpdateFile(filePath, memoryStream);
                }
                else
                {
                    isolatedStorage.CreateFile(filePath, memoryStream);
                }

            }
        }
        #endregion

        #region Add
        public void Add(T item, bool @override = true)
        {
            Save(item);
        }
        #endregion

        private void Save(T item)
        {
            string filePath = GetDataFilePath(item);
            _lock.EnterWriteLock();
            try
            {
                //save settings       
                Serialize(item, filePath);
            }
            finally
            {
                _lock.ExitWriteLock();
            }

        }

        #region Update
        public void Update(T item, T oldItem)
        {
            Save(item);
        }
        #endregion

        #region Remove
        public void Remove(T item)
        {
            string dirPath = GetItemPath(item);
            _lock.EnterWriteLock();
            try
            {
                isolatedStorage.DeleteDirectory(dirPath);
            }
            finally
            {
                _lock.ExitWriteLock();
            }
        }
        #endregion

        #region Export
        public void Export(IEnumerable<T> items, Stream outputStream)
        {
            //export
            //if (items == null || items.Count() == 0)
            //{
            //    using (ZipFile zipFile = new ZipFile(Encoding.UTF8))
            //    {
            //        zipFile.AddDirectory(_baseFolder, "");

            //        zipFile.Save(outputStream);
            //    }
            //}
            //else
            //{
            //    using (ZipFile zipFile = new ZipFile(Encoding.UTF8))
            //    {
            //        foreach (var item in items)
            //        {
            //            var dir = GetItemPath(item);
            //            zipFile.AddDirectory(dir, Path.GetFileName(dir));
            //        }

            //        zipFile.Save(outputStream);
            //    }
            //}

        }
        #endregion

        #region Import
        public void Import(Stream zipStream, bool @override)
        {
            //export
            //using (ZipFile zipFile = ZipFile.Read(zipStream))
            //{
            //    ExtractExistingFileAction action = ExtractExistingFileAction.DoNotOverwrite;
            //    if (@override)
            //    {
            //        action = ExtractExistingFileAction.OverwriteSilently;
            //    }
            //    zipFile.ExtractAll(_baseFolder, action);
            //}
        }
        #endregion
    }
}
