import React, { useState } from 'react'
import { View, Text, Input, Textarea, Button, Switch, Label } from '@tarojs/components'
import { motion } from 'framer-motion'
import Taro from '@tarojs/taro'
import { DoodleHeart, DoodleFlower } from '../../../components/DoodleElements'
import './PageForm.scss'

interface Guest {
  name: string
  relation: string
}

interface FormData {
  mainContact: string
  phone: string
  guests: Guest[]
  dietaryRestrictions: string
  isDriving: boolean
  needsShuttle: boolean
  shuttleLocation: string
  notes: string
}

interface PageFormProps {
  isActive: boolean
}

export const PageForm: React.FC<PageFormProps> = ({ isActive }) => {
  const [formData, setFormData] = useState<FormData>({
    mainContact: '',
    phone: '',
    guests: [{ name: '', relation: '' }],
    dietaryRestrictions: '',
    isDriving: false,
    needsShuttle: false,
    shuttleLocation: '',
    notes: ''
  })

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGuestChange = (index: number, field: keyof Guest, value: string) => {
    const newGuests = [...formData.guests]
    newGuests[index] = { ...newGuests[index], [field]: value }
    setFormData(prev => ({ ...prev, guests: newGuests }))
  }

  const addGuest = () => {
    setFormData(prev => ({ ...prev, guests: [...prev.guests, { name: '', relation: '' }] }))
  }

  const removeGuest = (index: number) => {
    const newGuests = formData.guests.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, guests: newGuests }))
  }

  const handleSubmit = async () => {
    if (!formData.phone) {
      Taro.showToast({ title: '请填写手机号', icon: 'none' })
      return
    }

    Taro.showLoading({ title: '提交中...' })

    try {
      // Replace with your actual Lambda function URL after deployment
      const API_ENDPOINT = process.env.TARO_ENV === 'weapp' 
        ? 'https://your-lambda-url.lambda-url.us-east-1.on.aws/'
        : 'https://your-lambda-url.lambda-url.us-east-1.on.aws/'

      const response = await Taro.request({
        url: API_ENDPOINT,
        method: 'POST',
        data: formData,
        header: {
          'Content-Type': 'application/json'
        }
      })

      if (response.statusCode === 200 && response.data.success) {
        Taro.showToast({ title: '提交成功！', icon: 'success' })
        // Reset form after successful submission
        setFormData({
          mainContact: '',
          phone: '',
          guests: [{ name: '', relation: '' }],
          dietaryRestrictions: '',
          isDriving: false,
          needsShuttle: false,
          shuttleLocation: '',
          notes: ''
        })
      } else {
        throw new Error(response.data.error || '提交失败')
      }
    } catch (error) {
      console.error('Submit error:', error)
      Taro.showToast({ 
        title: error.message || '网络错误，请重试', 
        icon: 'none',
        duration: 3000
      })
    } finally {
      Taro.hideLoading()
    }
  }

  return (
    <View className='page page-form'>
      <View className='content-wrapper'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <View className='form-header'>
            <Text className='page-title'>宾客表单</Text>
            <DoodleHeart className='header-heart' />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <View className='form-section'>
            <Label className='form-label'>主联系人</Label>
            <Input
              className='form-input'
              value={formData.mainContact}
              onInput={(e) => handleInputChange('mainContact', e.detail.value)}
              placeholder='请输入您的姓名'
            />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <View className='form-section required'>
            <Label className='form-label'>主联系人手机号 *</Label>
            <Input
              className='form-input'
              type='number'
              value={formData.phone}
              onInput={(e) => handleInputChange('phone', e.detail.value)}
              placeholder='请输入手机号（必填）'
            />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <View className='form-section'>
            <Label className='form-label'>同行赴宴人员</Label>
            {formData.guests.map((guest, index) => (
              <View key={index} className='guest-row'>
                <Input
                  className='guest-input'
                  value={guest.name}
                  onInput={(e) => handleGuestChange(index, 'name', e.detail.value)}
                  placeholder='姓名'
                />
                <Input
                  className='guest-input relation'
                  value={guest.relation}
                  onInput={(e) => handleGuestChange(index, 'relation', e.detail.value)}
                  placeholder='与主联系人关系'
                />
                {formData.guests.length > 1 && (
                  <Button className='remove-btn' onClick={() => removeGuest(index)}>-</Button>
                )}
              </View>
            ))}
            <Button className='add-btn' onClick={addGuest}>+ 添加同行人员</Button>
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <View className='form-section'>
            <Label className='form-label'>饮食忌口</Label>
            <Textarea
              className='form-textarea'
              value={formData.dietaryRestrictions}
              onInput={(e) => handleInputChange('dietaryRestrictions', e.detail.value)}
              placeholder='如有食物过敏或特殊饮食需求，请在此填写'
            />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <View className='form-section switches'>
            <View className='switch-row'>
              <Label className='switch-label'>是否自驾</Label>
              <Switch
                checked={formData.isDriving}
                onChange={(e) => handleInputChange('isDriving', e.detail.value)}
                disabled={formData.needsShuttle}
              />
            </View>
            <View className='switch-row'>
              <Label className='switch-label'>是否需要接驳服务</Label>
              <Switch
                checked={formData.needsShuttle}
                onChange={(e) => handleInputChange('needsShuttle', e.detail.value)}
                disabled={formData.isDriving}
              />
            </View>
          </View>
        </motion.div>

        {formData.needsShuttle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <View className='form-section'>
              <Label className='form-label'>接驳地点</Label>
              <Input
                className='form-input'
                value={formData.shuttleLocation}
                onInput={(e) => handleInputChange('shuttleLocation', e.detail.value)}
                placeholder='请输入您希望的接驳地点'
              />
            </View>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <View className='form-section'>
            <Label className='form-label'>您还希望我们知道什么？</Label>
            <Textarea
              className='form-textarea'
              value={formData.notes}
              onInput={(e) => handleInputChange('notes', e.detail.value)}
              placeholder='任何其他信息或问题都可以写在这里'
            />
          </View>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button className='submit-btn' onClick={handleSubmit}>
            提交
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <View className='thank-you-section'>
            <DoodleFlower className='thanks-flower' />
            <Text className='thanks-text'>感谢您的到来，期待与您相聚！</Text>
            <DoodleFlower className='thanks-flower' />
          </View>
        </motion.div>
      </View>
    </View>
  )
}
