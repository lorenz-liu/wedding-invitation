import React, { useState } from 'react'
import { View, Text, Input, Textarea, Button, Switch } from '@tarojs/components'
import { AnimatedView } from '../../../components/AnimatedView'
import Taro from '@tarojs/taro'
import { DoodleHeart, DoodleFlower, DoodleLine } from '../../../components/DoodleElements'
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
      <View className='paper-container'>
        {/* Paper Header */}
        <AnimatedView animation='fadeInUp' isActive={isActive} duration={800}>
          <View className='paper-header'>
            <View className='header-decoration left'>
              <DoodleFlower className='deco-flower' />
            </View>
            <View className='header-content'>
              <Text className='form-title'>回函</Text>
              <DoodleLine className='title-line' />
              <Text className='form-subtitle'>诚挚期待您的出席</Text>
            </View>
            <View className='header-decoration right'>
              <DoodleFlower className='deco-flower' />
            </View>
          </View>
        </AnimatedView>

        {/* Main Contact Section */}
        <AnimatedView animation='fadeInUp' isActive={isActive} delay={200} duration={600}>
          <View className='form-section contact-section'>
            <View className='section-header'>
              <View className='section-number'>01</View>
              <Text className='section-title'>联系人信息</Text>
            </View>
            <View className='input-group'>
              <View className='form-field'>
                <Text className='field-label'>姓名</Text>
                <Input
                  className='field-input'
                  value={formData.mainContact}
                  onInput={(e) => handleInputChange('mainContact', e.detail.value)}
                  placeholder='请输入您的姓名'
                />
                <View className='field-underline' />
              </View>
              <View className='form-field required'>
                <Text className='field-label'>手机号码 <Text className='required-mark'>*</Text></Text>
                <Input
                  className='field-input'
                  type='number'
                  value={formData.phone}
                  onInput={(e) => handleInputChange('phone', e.detail.value)}
                  placeholder='请输入手机号'
                />
                <View className='field-underline' />
              </View>
            </View>
          </View>
        </AnimatedView>

        {/* Guests Section */}
        <AnimatedView animation='fadeInUp' isActive={isActive} delay={350} duration={600}>
          <View className='form-section guests-section'>
            <View className='section-header'>
              <View className='section-number'>02</View>
              <Text className='section-title'>同行宾客</Text>
              <Text className='section-desc'>包括自己在内的所有赴宴人员</Text>
            </View>
            <View className='guests-list'>
              {formData.guests.map((guest, index) => (
                <View key={index} className='guest-card'>
                  <View className='guest-number'>{index + 1}</View>
                  <View className='guest-inputs'>
                    <Input
                      className='guest-input-name'
                      value={guest.name}
                      onInput={(e) => handleGuestChange(index, 'name', e.detail.value)}
                      placeholder='姓名'
                    />
                    <View className='input-divider' />
                    <Input
                      className='guest-input-relation'
                      value={guest.relation}
                      onInput={(e) => handleGuestChange(index, 'relation', e.detail.value)}
                      placeholder='与您的关系'
                    />
                  </View>
                  {formData.guests.length > 1 && (
                    <View className='remove-guest-btn' onClick={() => removeGuest(index)}>
                      <Text className='remove-icon'>×</Text>
                    </View>
                  )}
                </View>
              ))}
              <Button className='add-guest-btn' onClick={addGuest}>
                <Text className='add-icon'>+</Text>
                <Text className='add-text'>添加同行人员</Text>
              </Button>
            </View>
          </View>
        </AnimatedView>

        {/* Transport Section */}
        <AnimatedView animation='fadeInUp' isActive={isActive} delay={500} duration={600}>
          <View className='form-section transport-section'>
            <View className='section-header'>
              <View className='section-number'>03</View>
              <Text className='section-title'>出行方式</Text>
            </View>
            <View className='transport-options'>
              <View 
                className={`transport-card ${formData.isDriving ? 'selected' : ''}`}
                onClick={() => handleInputChange('isDriving', !formData.isDriving)}
              >
                <View className='transport-icon'>🚗</View>
                <Text className='transport-label'>自驾前往</Text>
                <View className={`selection-ring ${formData.isDriving ? 'active' : ''}`}>
                  {formData.isDriving && <View className='selection-dot' />}
                </View>
              </View>
              <View 
                className={`transport-card ${formData.needsShuttle ? 'selected' : ''}`}
                onClick={() => handleInputChange('needsShuttle', !formData.needsShuttle)}
              >
                <View className='transport-icon'>🚌</View>
                <Text className='transport-label'>需要接驳</Text>
                <View className={`selection-ring ${formData.needsShuttle ? 'active' : ''}`}>
                  {formData.needsShuttle && <View className='selection-dot' />}
                </View>
              </View>
            </View>
            
            {formData.needsShuttle && (
              <AnimatedView animation='fadeIn' isActive={true} duration={300}>
                <View className='shuttle-details'>
                  <Text className='shuttle-label'>请填写希望接驳的地点：</Text>
                  <Input
                    className='shuttle-input'
                    value={formData.shuttleLocation}
                    onInput={(e) => handleInputChange('shuttleLocation', e.detail.value)}
                    placeholder='例如：成都东站、双流机场等'
                  />
                </View>
              </AnimatedView>
            )}
          </View>
        </AnimatedView>

        {/* Dietary Section */}
        <AnimatedView animation='fadeInUp' isActive={isActive} delay={650} duration={600}>
          <View className='form-section dietary-section'>
            <View className='section-header'>
              <View className='section-number'>04</View>
              <Text className='section-title'>饮食偏好</Text>
              <Text className='section-desc'>过敏/忌口/素食等</Text>
            </View>
            <View className='text-area-wrapper'>
              <Textarea
                className='text-area'
                value={formData.dietaryRestrictions}
                onInput={(e) => handleInputChange('dietaryRestrictions', e.detail.value)}
                placeholder='如有任何饮食限制，请在此告诉我们...'
              />
              <View className='paper-lines'>
                <View className='paper-line' />
                <View className='paper-line' />
                <View className='paper-line' />
              </View>
            </View>
          </View>
        </AnimatedView>

        {/* Notes Section */}
        <AnimatedView animation='fadeInUp' isActive={isActive} delay={800} duration={600}>
          <View className='form-section notes-section'>
            <View className='section-header'>
              <View className='section-number'>05</View>
              <Text className='section-title'>其他留言</Text>
              <Text className='section-desc'>任何想说的话</Text>
            </View>
            <View className='text-area-wrapper'>
              <Textarea
                className='text-area'
                value={formData.notes}
                onInput={(e) => handleInputChange('notes', e.detail.value)}
                placeholder='祝福或任何想让我们知道的事情...'
              />
              <View className='paper-lines'>
                <View className='paper-line' />
                <View className='paper-line' />
                <View className='paper-line' />
                <View className='paper-line' />
              </View>
            </View>
          </View>
        </AnimatedView>

        {/* Submit Section */}
        <AnimatedView animation='fadeInUp' isActive={isActive} delay={950} duration={600}>
          <View className='submit-section'>
            <Button className='submit-btn' onClick={handleSubmit}>
              <DoodleHeart className='btn-heart' />
              <Text className='btn-text'>确认提交</Text>
              <DoodleHeart className='btn-heart' />
            </Button>
            <View className='submit-decoration'>
              <DoodleLine className='submit-line' />
            </View>
          </View>
        </AnimatedView>

        {/* Footer */}
        <AnimatedView animation='fadeIn' isActive={isActive} delay={1100} duration={600}>
          <View className='form-footer'>
            <View className='footer-flowers'>
              <DoodleFlower className='footer-flower' />
              <DoodleHeart className='footer-heart' />
              <DoodleFlower className='footer-flower' />
            </View>
            <Text className='footer-text'>感谢您的回复，期待与您相见</Text>
            <Text className='footer-names'>刘兆薰 & 高文珩 敬邀</Text>
          </View>
        </AnimatedView>
      </View>
    </View>
  )
}
